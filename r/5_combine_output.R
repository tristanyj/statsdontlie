library(jsonlite)

config <- fromJSON("r/output/config.json")
players <- fromJSON("r/output/players.json")

output <- list()
output$config <- config$config
output$players <- players$players

json_data <- jsonlite::toJSON(output, pretty = TRUE, auto_unbox = TRUE)
write(json_data, file = "r/output/dataset.json")

print("Successfully combined config and players into dataset.json")
