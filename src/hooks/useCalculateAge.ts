export const calculateAge = (birthdate: Date): number => {
    try {
      if (!(birthdate instanceof Date) || isNaN(birthdate.getTime())) {
        console.error("Invalid date provided to calculateAge");
        return 0;
      }
  
      const today = new Date();
  
      const birthYear = birthdate.getFullYear();
      const birthMonth = birthdate.getMonth();
      const birthDay = birthdate.getDate();
  
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const currentDay = today.getDate();
  
      let age = currentYear - birthYear;
  
      if (
        currentMonth < birthMonth ||
        (currentMonth === birthMonth && currentDay < birthDay)
      ) {
        age--;
      }
  
      return Math.max(0, age);
    } catch (error) {
      console.error("Error calculating age:", error);
      return 0;
    }
  };

  export default calculateAge;