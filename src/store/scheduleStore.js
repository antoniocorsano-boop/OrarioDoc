import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Initial sample schedule data
const initialSchedule = {
  monday: [
    { id: '1', subject: 'Matematica', startTime: '08:00', endTime: '09:00', class: '3A', room: '101' },
    { id: '2', subject: 'Matematica', startTime: '09:00', endTime: '10:00', class: '3B', room: '102' }
  ],
  tuesday: [
    { id: '3', subject: 'Fisica', startTime: '08:00', endTime: '09:00', class: '4A', room: '201' },
    { id: '4', subject: 'Matematica', startTime: '10:00', endTime: '11:00', class: '3A', room: '101' }
  ],
  wednesday: [
    { id: '5', subject: 'Matematica', startTime: '08:00', endTime: '09:00', class: '3A', room: '101' },
    { id: '6', subject: 'Fisica', startTime: '11:00', endTime: '12:00', class: '4A', room: '201' }
  ],
  thursday: [
    { id: '7', subject: 'Matematica', startTime: '09:00', endTime: '10:00', class: '3B', room: '102' },
    { id: '8', subject: 'Fisica', startTime: '10:00', endTime: '11:00', class: '4B', room: '202' }
  ],
  friday: [
    { id: '9', subject: 'Matematica', startTime: '08:00', endTime: '09:00', class: '3A', room: '101' },
    { id: '10', subject: 'Matematica', startTime: '09:00', endTime: '10:00', class: '3B', room: '102' }
  ]
};

const useScheduleStore = create(
  persist(
    (set) => ({
      schedule: initialSchedule,
      
      addLesson: (day, lesson) =>
        set((state) => ({
          schedule: {
            ...state.schedule,
            [day]: [...(state.schedule[day] || []), { ...lesson, id: Date.now().toString() }]
          }
        })),
      
      updateLesson: (day, lessonId, updatedLesson) =>
        set((state) => ({
          schedule: {
            ...state.schedule,
            [day]: state.schedule[day].map((lesson) =>
              lesson.id === lessonId ? { ...lesson, ...updatedLesson } : lesson
            )
          }
        })),
      
      deleteLesson: (day, lessonId) =>
        set((state) => ({
          schedule: {
            ...state.schedule,
            [day]: state.schedule[day].filter((lesson) => lesson.id !== lessonId)
          }
        })),
      
      clearSchedule: () =>
        set({ schedule: { monday: [], tuesday: [], wednesday: [], thursday: [], friday: [] } })
    }),
    {
      name: 'orariodoc-schedule',
    }
  )
);

export default useScheduleStore;
