async function fetchData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      // Handle any network or request errors
      console.error(`An error occurred: ${error}`);
      return null;
    }
}

