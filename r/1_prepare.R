install.packages(c("tidyverse", "rvest", "jsonlite", "chromote"))

library(tidyverse)
library(rvest)
library(jsonlite)

print(getwd())

players <- read.csv("r/input/dataref.csv")

print(players)

saveRDS(players, "r/input/dataref.rds")
