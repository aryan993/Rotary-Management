// utils/dateFormatter.js

export function formatDate(dateString) {

    if(dateString==null)
      return null
    // Create a Date object from the input string
    const date = new Date(dateString);

    // Extract month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    // Return the formatted date as mm/dd/yyyy
    return `${month}/${day}/${year}`;
  }