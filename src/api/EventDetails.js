const EventDetails = (url, event_id) =>
  fetch(url + 'wp-json/meup/v1/event_detail/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_id: event_id.toString(), // Must be a string
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      console.log('EventDetails response:', json); // helpful for debugging

      if (json && json.status === 'SUCCESS' && json.event) {
        const calendar = json.event.event_calendar || '';
        let timeOnly = '';

        if (calendar.includes(' - ')) {
          const [start, end] = calendar.split(' - ');
          const startTime = start.trim().split(' ').slice(-2).join(' ');
          const endTime = end.trim().split(' ').slice(-2).join(' ');
          timeOnly = `${startTime} - ${endTime}`;
        }

        return {
          event_time: timeOnly,
        };
      } else {
        throw new Error('Invalid response from event_detail');
      }
    })
    .catch((error) => {
      console.error('Error in EventDetails:', error);
      return { event_time: '' };
    });

module.exports = EventDetails;
