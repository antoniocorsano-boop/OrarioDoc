import React from 'react';
import useScheduleStore from '../../store/scheduleStore';
import './Schedule.css';

const DAYS = [
  { key: 'monday', label: 'Lunedì' },
  { key: 'tuesday', label: 'Martedì' },
  { key: 'wednesday', label: 'Mercoledì' },
  { key: 'thursday', label: 'Giovedì' },
  { key: 'friday', label: 'Venerdì' }
];

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

function Schedule() {
  const schedule = useScheduleStore((state) => state.schedule);

  const getLessonAtTime = (day, time) => {
    const lessons = schedule[day] || [];
    return lessons.find((lesson) => lesson.startTime === time);
  };

  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <h2>Orario Settimanale</h2>
        <p className="schedule-description">
          Visualizza e gestisci il tuo orario delle lezioni
        </p>
      </header>

      <div className="schedule-grid" role="table" aria-label="Orario settimanale delle lezioni">
        {/* Header row with days */}
        <div className="schedule-row header-row" role="row">
          <div className="time-header" role="columnheader">
            <span className="sr-only">Orario</span>
            <span aria-hidden="true">Ora</span>
          </div>
          {DAYS.map((day) => (
            <div key={day.key} className="day-header" role="columnheader">
              {day.label}
            </div>
          ))}
        </div>

        {/* Time slots rows */}
        {TIME_SLOTS.map((time) => (
          <div key={time} className="schedule-row" role="row">
            <div className="time-cell" role="rowheader">
              {time}
            </div>
            {DAYS.map((day) => {
              const lesson = getLessonAtTime(day.key, time);
              return (
                <div
                  key={`${day.key}-${time}`}
                  className={`lesson-cell ${lesson ? 'has-lesson' : ''}`}
                  role="cell"
                >
                  {lesson ? (
                    <div 
                      className="lesson-card"
                      role="article"
                      aria-label={`${lesson.subject}, classe ${lesson.class}, aula ${lesson.room}, dalle ${lesson.startTime} alle ${lesson.endTime}`}
                    >
                      <div className="lesson-subject">{lesson.subject}</div>
                      <div className="lesson-details">
                        <span className="lesson-class">Classe {lesson.class}</span>
                        <span className="lesson-room">Aula {lesson.room}</span>
                      </div>
                      <div className="lesson-time">
                        {lesson.startTime} - {lesson.endTime}
                      </div>
                    </div>
                  ) : (
                    <div className="empty-slot" aria-label="Nessuna lezione">
                      <span className="sr-only">Slot vuoto</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="schedule-legend">
        <h3 className="legend-title">Legenda</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color has-lesson"></div>
            <span>Lezione programmata</span>
          </div>
          <div className="legend-item">
            <div className="legend-color empty"></div>
            <span>Ora libera</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
