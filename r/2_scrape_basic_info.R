library(tidyverse)
library(rvest)
library(chromote)
library(stringr)

b <- ChromoteSession$new()

process_stat_value <- function(value) {
  if (is.na(value) || value == "") {
    return(0)
  }

  num_value <- suppressWarnings(as.numeric(value))
  if (is.na(num_value)) {
    return(0)
  }

  return(num_value)
}

total_stat_ids <- c(
  "g" = "total.games_played",
  "gs" = "total.games_started",
  "mp" = "total.minutes_played",
  "fg" = "total.field_goals_made",
  "fga" = "total.field_goal_attempts",
  "fg_pct" = "total.field_goal_percentage",
  "fg3" = "total.three_point_field_goals_made",
  "fg3a" = "total.three_point_field_goal_attempts",
  "fg3_pct" = "total.three_point_field_goal_percentage",
  "ft" = "total.free_throws_made",
  "fta" = "total.free_throw_attempts",
  "ft_pct" = "total.free_throw_percentage",
  "orb" = "total.offensive_rebounds",
  "drb" = "total.defensive_rebounds",
  "trb" = "total.total_rebounds",
  "ast" = "total.assists",
  "stl" = "total.steals",
  "blk" = "total.blocks",
  "tov" = "total.turnovers",
  "pf" = "total.personal_fouls",
  "pts" = "total.points",
  "trp_dbl" = "total.triple_doubles"
)

per_games_stat_ids <- c(
  "mp_per_g" = "per_game.minutes_played",
  "fg_per_g" = "per_game.field_goals_made",
  "fga_per_g" = "per_game.field_goal_attempts",
  "fg3_per_g" = "per_game.three_point_field_goals_made",
  "fg3a_per_g" = "per_game.three_point_field_goal_attempts",
  "ft_per_g" = "per_game.free_throws_made",
  "fta_per_g" = "per_game.free_throw_attempts",
  "orb_per_g" = "per_game.offensive_rebounds",
  "drb_per_g" = "per_game.defensive_rebounds",
  "trb_per_g" = "per_game.total_rebounds",
  "ast_per_g" = "per_game.assists",
  "stl_per_g" = "per_game.steals",
  "blk_per_g" = "per_game.blocks",
  "tov_per_g" = "per_game.turnovers",
  "pf_per_g" = "per_game.personal_fouls",
  "pts_per_g" = "per_game.points"
)

advanced_stat_ids <- c(
  "per" = "advanced.player_efficiency_rating",
  "ts_pct" = "advanced.true_shooting_percentage",
  "usg_pct" = "advanced.usage_percentage",
  "ws" = "advanced.win_shares",
  "bpm" = "advanced.box_plus_minus",
  "vorp" = "advanced.value_over_replacement_player"
)

game_high_stat_ids <- c(
  "fg" = "game_high.field_goals_made",
  "fga" = "game_high.field_goal_attempts",
  "fg3" = "game_high.three_point_field_goals_made",
  "fg3a" = "game_high.three_point_field_goal_attempts",
  "ft" = "game_high.free_throws_made",
  "fta" = "game_high.free_throw_attempts",
  "orb" = "game_high.offensive_rebounds",
  "drb" = "game_high.defensive_rebounds",
  "trb" = "game_high.total_rebounds",
  "ast" = "game_high.assists",
  "stl" = "game_high.steals",
  "blk" = "game_high.blocks",
  "tov" = "game_high.turnovers",
  "pts" = "game_high.points"
)

create_stat_ids_with_prefix <- function(stat_ids, prefix) {
  setNames(
    paste(prefix, stat_ids, sep = "."),
    names(stat_ids)
  )
}

extract_player_info <- function(page) {
  tryCatch({
    info_section <- page %>%
      html_node("div#meta")

    name <- info_section %>%
      html_node("h1 span") %>%
      html_text()

    return(list(
      name = name
    ))
  }, error = function(e) {
    warning(paste("Error extracting player info:", e$message))
    return(NULL)
  })
}

# ----------------------------
# Extractors
# ----------------------------

is_first_row_header <- function(footer) {
  th_count <- footer %>%
    html_nodes("tr:nth-child(1) th") %>%
    length()

  print(th_count)

  return(th_count > 5)
}

extract_from_row <- function(page, selector, stat_ids, prefix) {
  tryCatch({
    footer <- page %>%
      html_node(selector)

    row_index <- if (is_first_row_header(footer)) 2 else 1

    row_selector <- paste0(selector, " tr:nth-child(", row_index, ")")
    print(row_selector)

    row <- page %>%
      html_nodes(paste0(selector, " tr:nth-child(", row_index, ") td"))

    stat_ids_with_prefix <- create_stat_ids_with_prefix(stat_ids, prefix)

    result <- list()

    for (stat in row) {
      stat_id <- stat %>% html_attr("data-stat")

      if (stat_id %in% names(stat_ids_with_prefix)) {
        stat_value <- stat %>% html_text()

        result[[stat_ids_with_prefix[stat_id]]] <- process_stat_value(stat_value)
      }
    }

    return(result)
  }, error = function(e) {
    warning(paste("Error extracting total stats:", e$message))
    return(NULL)
  })
}

extract_conf_championships <- function(page) {
  tryCatch({
    text <- page %>%
      html_nodes("#playoffs-series tbody tr[data-row] td[data-stat='round_id'] a") %>%
      html_text() %>%
      str_trim()

    conference_championships <- 0

    for (entry in text) {
      if (str_detect(entry, "FIN")) {
        conference_championships <- conference_championships + 1
      }
    }

    return(conference_championships)
  }, error = function(e) {
    warning(paste("Error extracting conference championships:", e$message))
    return(NULL)
  })
}

extract_all_team_awards <- function(page) {
  tryCatch({
    text <- page %>%
      html_nodes("#leaderboard_all_league tbody td") %>%
      html_text() %>%
      str_trim()

    all_nba <- 0
    all_nba_first <- 0
    all_nba_second <- 0
    all_nba_third <- 0
    all_defensive <- 0
    all_defensive_first <- 0
    all_defensive_second <- 0

    for (entry in text) {
      team_type <- str_extract(entry, "All-NBA|All-Defensive")

      if (is.na(team_type)) {
        next
      }

      team_rank <- entry %>%
        str_extract("\\(([1-3])[a-z]{2}\\)") %>%
        str_extract("\\d") %>%
        as.numeric()

      if (is.na(team_rank)) {
        next
      }

      if (team_type == "All-NBA") {
        all_nba <- all_nba + 1
        if (team_rank == 1) {
          all_nba_first <- all_nba_first + 1
        } else if (team_rank == 2) {
          all_nba_second <- all_nba_second + 1
        } else if (team_rank == 3) {
          all_nba_third <- all_nba_third + 1
        }
      } else if (team_type == "All-Defensive") {
        all_defensive <- all_defensive + 1
        if (team_rank == 1) {
          all_defensive_first <- all_defensive_first + 1
        } else if (team_rank == 2) {
          all_defensive_second <- all_defensive_second + 1
        }
      }
    }

    return(list(
      all_nba = all_nba,
      all_nba_first = all_nba_first,
      all_nba_second = all_nba_second,
      all_nba_third = all_nba_third,
      all_defensive = all_defensive,
      all_defensive_first = all_defensive_first,
      all_defensive_second = all_defensive_second
    ))
  }, error = function(e) {
    warning(paste("Error extracting all-team awards:", e$message))
    return(NULL)
  })
}

extract_selection_count <- function(page, selector) {
  tryCatch({
    count <- page %>%
      html_nodes(selector) %>%
      length()

    return(count)
  }, error = function(e) {
    warning(paste("Error extracting selections:", e$message))
    return(NULL)
  })
}

# ----------------------------
# Extract By Group
# ----------------------------

extract_regular_season_stats <- function(page) {
  tryCatch({
    prefix <- "regular_season"
    total_stats <- extract_from_row(page, "#totals tfoot", total_stat_ids, prefix)
    per_game_stats <- extract_from_row(page, "#per_game_stats tfoot", per_games_stat_ids, prefix)
    advanced_stats <- extract_from_row(page, "#advanced tfoot", advanced_stat_ids, prefix)
    game_high_stats <- extract_from_row(page, "#highs-reg-season tfoot", game_high_stat_ids, prefix)

    result <- c(total_stats, per_game_stats, advanced_stats, game_high_stats)

    return(result)
  }, error = function(e) {
    warning(paste("Error extracting regular season stats:", e$message))
    return(NULL)
  })
}

extract_post_season_stats <- function(page) {
  tryCatch({
    prefix <- "post_season"
    total_stats <- extract_from_row(page, "#playoffs_totals tfoot", total_stat_ids, prefix)
    per_game_stats <- extract_from_row(page, "#per_game_stats_post tfoot", per_games_stat_ids, prefix)
    advanced_stats <- extract_from_row(page, "#advanced_post tfoot", advanced_stat_ids, prefix)
    game_high_stats <- extract_from_row(page, "#highs-playoffs tfoot", game_high_stat_ids, prefix)

    result <- c(total_stats, per_game_stats, advanced_stats, game_high_stats)

    return(result)
  }, error = function(e) {
    warning(paste("Error extracting post season stats:", e$message))
    return(NULL)
  })
}

extract_awards <- function(page) {
  tryCatch({
    mvp <- extract_selection_count(page, "#leaderboard_notable-awards td a[href='/awards/mvp.html']")
    finals_mvp <- extract_selection_count(page, "#leaderboard_notable-awards td a[href='/awards/finals_mvp.html']")
    dpoy <- extract_selection_count(page, "#leaderboard_notable-awards td a[href='/awards/dpoy.html']")
    all_star <- extract_selection_count(page, "#leaderboard_allstar tbody td")
    player_of_the_week <- extract_selection_count(page, "#leaderboard_weekly_awards tbody td")
    player_of_the_month <- extract_selection_count(page, "#leaderboard_monthly_awards tbody td")
    nba_championships <- extract_selection_count(page, "#leaderboard_championships tbody td")
    all_team <- extract_all_team_awards(page)
    conference_championships <- extract_conf_championships(page)

    awards <- list(
      awards.individual.mvp = mvp,
      awards.individual.finals_mvp = finals_mvp,
      awards.individual.dpoy = dpoy,
      awards.individual.all_star = all_star,
      awards.individual.all_nba = all_team$all_nba,
      awards.individual.all_nba_first = all_team$all_nba_first,
      awards.individual.all_nba_second = all_team$all_nba_second,
      awards.individual.all_nba_third = all_team$all_nba_third,
      awards.individual.all_defensive = all_team$all_defensive,
      awards.individual.all_defensive_first = all_team$all_defensive_first,
      awards.individual.all_defensive_second = all_team$all_defensive_second,
      awards.individual.player_week = player_of_the_week,
      awards.individual.player_month = player_of_the_month,
      awards.team.nba_championships = nba_championships,
      awards.team.conference_championships = conference_championships
    )

    return(awards)
  }, error = function(e) {
    warning(paste("Error extracting awards:", e$message))
    return(NULL)
  })
}

scrape_player <- function(id, url) {
  Sys.sleep(3)

  tryCatch({
    b$Page$navigate(url)
    Sys.sleep(3)

    b$Runtime$evaluate("window.scrollTo(0, document.body.scrollHeight)")
    Sys.sleep(2)

    html_content <- b$Runtime$evaluate("document.documentElement.outerHTML")$result$value

    page <- read_html(html_content)

    info <- extract_player_info(page)
    regular_season_stats <- extract_regular_season_stats(page)
    post_season_stats <- extract_post_season_stats(page)
    awards <- extract_awards(page)

    stats <- c(regular_season_stats, post_season_stats, awards)

    player_data <- list(
      id = id,
      info = info,
      stats = stats
    )

    return(player_data)
  }, error = function(e) {
    warning(paste("Error scraping", url, ":", e$message))
    return(NULL)
  })
}

# Main execution
if (file.exists("r/output/players_base.rds")) {
  players <- readRDS("r/output/players_base.rds")
  print("Successfully loaded players data")
} else {
  stop("Cannot find players_base.rds. Make sure to run 1_read_players.R first")
}

all_players_data <- list()
all_players_data$players <- list()

for (i in 1:5) {
  player_data <- scrape_player(players$id[i], players$bbref_url[i])
  all_players_data$players[[i]] <- player_data
}

json_data <- jsonlite::toJSON(all_players_data, pretty = TRUE, auto_unbox = TRUE)
write(json_data, "r/output/players.json")

print("Done scraping players data")
print("Check output/players.json for the result")

b$close()
