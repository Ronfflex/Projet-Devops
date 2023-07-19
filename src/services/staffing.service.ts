import { UserModel } from "../models/employee.model";


export class StaffingService {
    async isZooStaffed(): Promise<[boolean, string]> {
      const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
      const currentTime = new Date();

      type StaffRole = 'receptionist' | 'doctor' | 'service_agent' | 'seller';
      const requiredStaff: Record<StaffRole, boolean> = {
          'receptionist': false,
          'doctor': false,
          'service_agent': false,
          'seller': false,
      };

      const workingHours: { start: Date; end: Date }[] = [];

      const activeEmployees = await UserModel.find({ active: true }).populate('role');
      
      for (let employee of activeEmployees) {
        const roleName = employee.role.name.toLowerCase() as StaffRole;
        
        // Check if the employee's role is one of the required roles
        if (Object.keys(requiredStaff).includes(roleName)) {
          const shifts = employee.workShift;

          // Find the shift for today
          let shiftToday = shifts.find(shift => shift.day === currentDay);
        
          if (shiftToday) {
            // Convert shift start and end times to Date objects
            let startHourMinutes = shiftToday.start.split(':').map(Number);
            let endHourMinutes = shiftToday.end.split(':').map(Number);
            let startDate = new Date();
            startDate.setHours(startHourMinutes[0], startHourMinutes[1]);
            let endDate = new Date();
            endDate.setHours(endHourMinutes[0], endHourMinutes[1]);

            // Add the start and end times to the workingHours array
            workingHours.push({ start: startDate, end: endDate });

            // Mark the role as filled
            requiredStaff[roleName] = true;
          }
        }
      }
  
    // If all required roles are filled, check opening and closing times
    if (Object.values(requiredStaff).every(role => role === true)) {
      // Get the latest start time and the earliest end time among all employees
      let openingTime = Math.max(...workingHours.map(hours => hours.start.getTime()));
      let closingTime = Math.min(...workingHours.map(hours => hours.end.getTime()));
      let openingHour = new Date(openingTime);
      let closingHour = new Date(closingTime);

      // Check if the current time is before opening or after closing
      if (currentTime.getTime() < openingTime) {
          return [false, `Zoo is not open yet. It will open at ${openingHour.getHours()}:${openingHour.getMinutes() < 10 ? '0' + openingHour.getMinutes() : openingHour.getMinutes()}.`];
      }
      
      if (currentTime.getTime() > closingTime) {
          return [false, 'Zoo is closed for the day.'];
      }

      // If it's not before opening or after closing, the zoo is open
      return [true, `Zoo is open. It will close at ${closingHour.getHours()}:${closingHour.getMinutes() < 10 ? '0' + closingHour.getMinutes() : closingHour.getMinutes()}.`];
  }

  // If not all required roles are filled, the zoo is not sufficiently staffed
  return [false, 'Zoo is not sufficiently staffed.'];
  }
}
  