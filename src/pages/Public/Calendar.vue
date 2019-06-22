<template>
  <q-page >
    <daykeep-calendar-month
      :start-date="new Date('2019-01-01')"
      :event-array="someEventObject"
      :sunday-first-day-of-week="true"
      calendar-locale="fr"
      calendar-timezone="Europe/Paris"
      :allow-editing="false"
      :render-html="true"
    />
  </q-page>
</template>

<style>
</style>

<script>
import {
  DaykeepCalendarMonth,
  DaykeepCalendarAgenda,
  DaykeepCalendarMultiDay
} from "@daykeep/calendar-quasar";
export default {
  name: "CalendarPage",
  components: {
    DaykeepCalendarMonth
  },
  data() {
    return {
      someEventObject: [
        {
          id: 1,
          summary: "Test event",
          description: "Some extra info goes here",
          location:
            "Office of the Divine Randomness, 1232 Main St., Denver, CO",
          start: {
            dateTime: "2019-01-01T14:00:00", // ISO 8601 formatted
            timeZone: "America/New_York" // Timezone listed as a separate IANA code
          },
          end: {
            dateTime: "2019-01-01T16:30:00",
            timeZone: "American/New_York"
          },
          color: "positive",
          attendees: [
            {
              id: 5,
              email: "somebody@somewhere.com",
              displayName: "John Q. Public",
              organizer: true,
              self: false,
              resource: false
            }
          ]
        },
        {
          id: 2,
          summary: "Test all-day event",
          description: "Some extra info goes here",
          start: {
            date: "2019-01-01" // A date variable indicates an all-day event
          },
          end: {
            date: "2019-01-01"
          }
        },
        {
          id: 3,
          summary: "Some other test event",
          description: "Some extra info goes here",
          start: {
            dateTime: "2019-01-01T10:00:00+0500" // timezone embedded in dateTime
          },
          end: {
            dateTime: "2019-01-01T12:30:00+0500"
          }
        }
      ]
    };
  }
};
</script>
