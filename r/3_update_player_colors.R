library(jsonlite)

players_json <- fromJSON("r/output/players.json", simplifyVector = FALSE)

if (file.exists("r/input/players.rds")) {
  players_input <- readRDS("r/input/players.rds")
  print("Successfully loaded players data")
} else {
  stop("Cannot find players.rds. Make sure to run 1_prepare_input.R first")
}

update_player_colors <- function(players_json, players_input) {
  color_lookup <- setNames(players_input$color, players_input$id)

  for (i in seq_along(players_json$players)) {
    player_id <- players_json$players[[i]][["id"]]
    if (!player_id %in% names(color_lookup)) {
      stop("Cannot find player with id ", player_id)
    }
    players_json$players[[i]][["color"]] <- color_lookup[player_id]
  }

  return(players_json)
}

updated_json <- update_player_colors(players_json, players_input)
write_json(updated_json, "r/output/players.json", pretty = TRUE, auto_unbox = TRUE)

print("Successfully updated player colors in players.json")
