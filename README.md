# Phonebook web app

App serves the phonebook react frontend made in part 2 found here: https://github.com/hagantsa/fullstack-open-exercises/tree/main/part2/phonebook

This repo contains the express backend and just the production build of the frontend. In this repo there are also configuration files for fly.io. Note that the backend uses the port 8080 as apparently required by fly.io.

The url to the app deployed to fly.io is here:
https://still-wildflower-5080.fly.dev/

The deploy script is kinda scuffed, as it has hardcoded paths for this repo and the repo where the frontend resides.