# Schedule Page (Pagina orario)

The Schedule page is the main feature of OrarioDoc, allowing teachers to view and manage their weekly timetable.

## Features

- **Weekly Overview**: View your complete weekly schedule from Monday to Friday
- **Time Slots**: Hourly schedule from 08:00 to 16:00
- **Lesson Details**: Each lesson card displays:
  - Subject name
  - Class identifier
  - Room number
  - Time range
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: Fully accessible with screen reader support and keyboard navigation
- **Offline Support**: Works offline thanks to PWA capabilities
- **Data Persistence**: Your schedule is automatically saved to local storage

## Data Structure

Each lesson in the schedule contains:

```javascript
{
  id: 'unique-id',
  subject: 'Matematica',
  startTime: '08:00',
  endTime: '09:00',
  class: '3A',
  room: '101'
}
```

## State Management

The schedule is managed using Zustand with local storage persistence. The store is located at `src/store/scheduleStore.js` and provides the following methods:

- `addLesson(day, lesson)`: Add a new lesson to a specific day
- `updateLesson(day, lessonId, updatedLesson)`: Update an existing lesson
- `deleteLesson(day, lessonId)`: Remove a lesson from the schedule
- `clearSchedule()`: Clear all lessons from the schedule

## Usage Example

```javascript
import useScheduleStore from './store/scheduleStore';

function MyComponent() {
  const schedule = useScheduleStore((state) => state.schedule);
  const addLesson = useScheduleStore((state) => state.addLesson);

  const handleAddLesson = () => {
    addLesson('monday', {
      subject: 'Storia',
      startTime: '14:00',
      endTime: '15:00',
      class: '2B',
      room: '203'
    });
  };

  return (
    // Your component JSX
  );
}
```

## Accessibility

The Schedule page follows WCAG 2.1 Level AA guidelines:

- Semantic HTML with proper table structure
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast colors
- Clear focus indicators

## Customization

You can customize the schedule by:

1. **Changing time slots**: Edit the `TIME_SLOTS` array in `Schedule.jsx`
   ```javascript
   const TIME_SLOTS = ['08:00', '09:00', '10:00', ...];
   ```

2. **Adding days**: Modify the `DAYS` array to include weekends. Each day is an object with `key` and `label` properties:
   ```javascript
   const DAYS = [
     { key: 'monday', label: 'Lunedì' },
     { key: 'tuesday', label: 'Martedì' },
     // Add more days...
     { key: 'saturday', label: 'Sabato' },
     { key: 'sunday', label: 'Domenica' }
   ];
   ```

3. **Styling**: Update `Schedule.css` with your custom colors and styles

4. **Initial data**: Modify the `initialSchedule` in `scheduleStore.js`. Remember to add corresponding day keys if you add new days.

## Future Enhancements

Planned features for the Schedule page:

- [ ] Add/Edit/Delete lessons directly from the UI
- [ ] Drag and drop to reschedule lessons
- [ ] Color coding by subject
- [ ] Export schedule to PDF/CSV
- [ ] Import schedule from external sources
- [ ] AI-powered scheduling suggestions
- [ ] Conflict detection
- [ ] Recurring lessons support
