library(tidyverse)
library(rvest)
library(chromote)
library(stringr)

b <- ChromoteSession$new()

# ----------------------------
# Helper functions
# ----------------------------

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

is_first_row_header <- function(footer) {
  th_count <- footer %>%
    html_nodes("tr:nth-child(1) th") %>%
    length()

  return(th_count > 5)
}

create_stat_ids_with_prefix <- function(stat_ids, prefix) {
  setNames(
    paste(prefix, stat_ids, sep = "."),
    names(stat_ids)
  )
}

get_nicknames_p <- function(all_paragraphs) {
  nicknames_p <- NULL

  for (p in all_paragraphs) {
    text <- html_text(p) %>% str_trim()
    has_desc_span <- length(html_nodes(p, "span.desc")) > 0
    if (str_detect(text, "^\\s*\\(") &&
          !str_detect(text, "Formerly known as") &&
          !has_desc_span) {
      nicknames_p <- p
      break
    }
  }

  return(nicknames_p)
}

# ----------------------------
# Constants
# ----------------------------

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

# ----------------------------
# Extractors
# ----------------------------

extract_from_row <- function(page, selector, stat_ids, prefix) {
  tryCatch({
    footer <- page %>%
      html_node(selector)

    row_index <- if (is_first_row_header(footer)) 2 else 1

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

extract_teams_played_for <- function(page) {
  tryCatch({
    teams <- page %>%
      html_nodes("#per_game_stats tbody td[data-stat='team_name_abbr'] a") %>%
      html_text() %>%
      str_trim() %>%
      unique()

    return(teams)
  }, error = function(e) {
    warning(paste("Error extracting teams played for:", e$message))
    return(NULL)
  })
}

extract_nickname <- function(p) {
  tryCatch({
    nickname <- p %>%
      html_text() %>%
      str_trim() %>%
      str_extract("\\((.*?),") %>%
      str_remove("\\(") %>%
      str_remove(",")

    return(nickname)
  }, error = function(e) {
    warning(paste("Error extracting nickname:", e$message))
    return(NULL)
  })
}

extract_height <- function(p) {
  tryCatch({
    height <- p %>%
      html_text() %>%
      str_trim() %>%
      str_extract("\\d+-\\d+")

    return(height)
  }, error = function(e) {
    warning(paste("Error extracting height:", e$message))
    return(NULL)
  })
}

extract_weight <- function(p) {
  tryCatch({
    weight <- p %>%
      html_text() %>%
      str_trim() %>%
      str_extract("\\d+(?=lb)")

    return(weight)
  }, error = function(e) {
    warning(paste("Error extracting weight:", e$message))
    return(NULL)
  })
}

extract_draft_info <- function(p) {
  tryCatch({
    text <- p %>%
      html_text() %>%
      str_trim()

    position <- text %>%
      str_extract("\\d+(?:st|nd|rd|th) overall") %>%
      str_extract("\\d+") %>%
      as.numeric()

    year <- text %>%
      str_extract("\\d{4}(?=\\sNBA Draft)") %>%
      as.numeric()

    c(position, year)
  }, error = function(e) {
    warning(paste("Error extracting draft info:", e$message))
    return(NULL)
  })
}

extract_birth_date <- function(p) {
  tryCatch({
    birth_date <- p %>%
      html_attr("data-birth")

    return(birth_date)
  }, error = function(e) {
    warning(paste("Error extracting birth date:", e$message))
    return(NULL)
  })
}

extract_main_position <- function(p) {
  tryCatch({
    text <- p %>%
      html_text() %>%
      str_trim() %>%
      str_replace_all("\\s+", " ")

    main_position <- text %>%
      str_extract("Position:\\s*(.*?)(?=\\s*▪|\\s*Shoots:|\\s*,|\\s+and\\s+)") %>%
      str_remove("Position:\\s*") %>%
      str_trim()

    return(main_position)
  }, error = function(e) {
    warning(paste("Error extracting main position:", e$message))
    return(NULL)
  })
}

extract_shooting_hand <- function(p) {
  tryCatch({
    shooting_hand <- p %>%
      html_text() %>%
      str_extract("Shoots:\\s*([A-Za-z]+)") %>%
      str_remove("Shoots:\\s*") %>%
      str_trim()

    return(shooting_hand)
  }, error = function(e) {
    warning(paste("Error extracting shooting hand:", e$message))
    return(NULL)
  })
}

extract_experience <- function(p) {
  tryCatch({
    experience <- p %>%
      html_text() %>%
      str_extract("\\d+(?=\\syears)") %>%
      as.numeric()

    return(experience)
  }, error = function(e) {
    warning(paste("Error extracting experience:", e$message))
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

extract_all_team_awards <- function(page) { # nolint
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

# ----------------------------
# Extract By Group
# ----------------------------

extract_player_info <- function(page) {
  tryCatch({
    find_paragraph <- function(nodes, pattern) {
      text_contents <- html_text(nodes)
      matching_index <- which(str_detect(text_contents, pattern))
      if (length(matching_index) > 0) {
        nodes[[matching_index[1]]]
      } else {
        NULL
      }
    }

    all_paragraphs <- page %>%
      html_nodes("#meta div:nth-child(2) p")

    name <- page %>%
      html_node("#meta h1 span") %>%
      html_text()

    nicknames_p <- get_nicknames_p(all_paragraphs)
    position_p <- find_paragraph(all_paragraphs, "Position:")
    measurements_p <- find_paragraph(all_paragraphs, "\\d+-\\d+.*\\d+lb")
    birth_p <- html_node(page, "span#necro-birth")
    draft_p <- find_paragraph(all_paragraphs, "Draft:")
    experience_p <- find_paragraph(all_paragraphs, "(Experience|Career Length):.*years")

    teams <- extract_teams_played_for(page)

    return(list(
      name = name,
      nickname = if (!is.null(nicknames_p)) extract_nickname(nicknames_p) else NA,
      position = if (!is.null(position_p)) extract_main_position(position_p) else NULL,
      shooting_hand = if (!is.null(position_p)) extract_shooting_hand(position_p) else NA,
      height = if (!is.null(measurements_p)) extract_height(measurements_p) else NA,
      weight = if (!is.null(measurements_p)) extract_weight(measurements_p) else NA,
      birth_date = if (!is.null(birth_p)) extract_birth_date(birth_p) else NA,
      draft = if (!is.null(draft_p)) extract_draft_info(draft_p) else NA,
      experience = if (!is.null(experience_p)) extract_experience(experience_p) else NA,
      teams = teams
    ))
  }, error = function(e) {
    warning(paste("Error extracting player info:", e$message))
    return(NULL)
  })
}

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

# ----------------------------
# Scrape entry point
# ----------------------------

scrape_player <- function(id, url, color) {
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
      color = color,
      info = info,
      stats = stats
    )

    return(player_data)
  }, error = function(e) {
    warning(paste("Error scraping", url, ":", e$message))
    return(NULL)
  })
}

# ----------------------------
# Main execution
# ----------------------------

if (file.exists("r/input/players.rds")) {
  players <- readRDS("r/input/players.rds")
  print("Successfully loaded players data")
} else {
  stop("Cannot find players.rds. Make sure to run 1_prepare_input.R first")
}

output <- list()
output$players <- list()

max <- 1

for (i in 1:max) {
  id <- players$id[i]
  url <- players$bbref_url[i]
  color <- players$color[i]

  print(paste("[", i, "/", max, "] Scraping player ", id, " at ", url, sep = ""))

  player_data <- scrape_player(id, url, color)

  output$players[[i]] <- player_data
}

json_data <- jsonlite::toJSON(output, pretty = TRUE, auto_unbox = TRUE)
write(json_data, "r/output/players.json")

print("Done scraping players data")
print("Check output/players.json for the result")

b$close()
