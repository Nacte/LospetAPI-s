// Function to validate date format
const isValidDate = (dateString) => {
  // Use a regular expression to check if the dateString matches the desired format
  const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  return dateRegex.test(dateString);
};

module.exports = { isValidDate };
