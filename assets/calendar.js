(() => {
  const calendar = document.querySelector('.calendar');
  const heading = document.getElementById('calendar-month');
  const days = document.getElementById('calendar-days');
  const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
  const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });
  const easternDateFormat = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric'
  });

  function today() {
    const parts = Object.fromEntries(easternDateFormat.formatToParts(new Date())
      .filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
    return new Date(parts.year, parts.month - 1, parts.day, 12);
  }

  let displayedMonth = today();
  displayedMonth.setDate(1);

  function render() {
    const currentDay = today();
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();
    const firstWeekday = displayedMonth.getDay();
    const monthLength = new Date(year, month + 1, 0, 12).getDate();
    const cellCount = Math.ceil((firstWeekday + monthLength) / 7) * 7;
    const fragment = document.createDocumentFragment();
    let row;

    heading.textContent = monthFormat.format(displayedMonth);
    for (let index = 0; index < cellCount; index += 1) {
      if (index % 7 === 0) {
        row = document.createElement('tr');
        fragment.append(row);
      }
      const date = new Date(year, month, index - firstWeekday + 1, 12);
      const cell = document.createElement('td');
      const time = document.createElement('time');
      const inMonth = date.getMonth() === month;
      const isToday = date.getTime() === currentDay.getTime();
      cell.className = inMonth ? 'calendar-day' : 'calendar-day calendar-day-outside';
      time.dateTime = [String(date.getFullYear()).padStart(4, '0'),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')].join('-');
      time.textContent = date.getDate();
      time.setAttribute('aria-label', dateFormat.format(date));
      if (isToday) {
        cell.className += ' calendar-day-today';
        time.setAttribute('aria-current', 'date');
      }
      cell.append(time);
      row.append(cell);
    }
    days.replaceChildren(fragment);
  }

  document.getElementById('calendar-previous').addEventListener('click', () => {
    displayedMonth.setMonth(displayedMonth.getMonth() - 1);
    render();
  });
  document.getElementById('calendar-next').addEventListener('click', () => {
    displayedMonth.setMonth(displayedMonth.getMonth() + 1);
    render();
  });
  document.getElementById('calendar-today').addEventListener('click', () => {
    displayedMonth = today();
    displayedMonth.setDate(1);
    render();
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) render();
  });
  render();
  calendar.hidden = false;
})();
