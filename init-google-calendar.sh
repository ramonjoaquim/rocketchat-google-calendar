#!/bin/bash
while true; do
 echo '>>>>> Checking google calendar initialized.'	
 python3 calendarWebhook.py
 echo '>>>>> Checking google calendar ended.'
 sleep 300 #that would mean running the actual script every 5 mins
done