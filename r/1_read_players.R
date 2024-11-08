install.packages(c("tidyverse", "rvest", "jsonlite", "chromote"))

library(tidyverse)
library(rvest)
library(jsonlite)

print(getwd())

players <- read.csv("r/input/references.csv")

print(players)

saveRDS(players, "r/output/players_base.rds")

