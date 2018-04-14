#!/bin/bash

now rm team7chat -y --safe --team team7chat --token=$NOW_TOKEN
now --public --team team7chat --token=$NOW_TOKEN
now alias --team team7chat --token=$NOW_TOKEN
