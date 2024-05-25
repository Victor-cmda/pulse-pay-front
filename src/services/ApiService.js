class ApiService {
    static async submitPayment(data) {
      try {
        const response = await fetch('https://localhost:7000/api/Payments/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
  
        return await response.json();
      } catch (error) {
        throw error;
      }
    }
  }
  
  export default ApiService;
  