library(tidyverse)
library(rvest)
library(jsonlite)

files <- list(
  "players" = "r/input/players.csv",
  "categories" = "r/input/categories.csv",
  "subcategories" = "r/input/subcategories.csv",
  "stats" = "r/input/stats.csv"
)

for (i in seq_along(files)) {
  name <- names(files)[i]
  print(paste("[", i, "/", length(files), "] Reading ", files[[name]], sep = ""))

  data <- read.csv(files[[name]])
  saveRDS(data, file.path("r/input", paste0(name, ".rds")))
}
