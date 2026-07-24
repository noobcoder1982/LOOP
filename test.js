fetch('http://localhost:3000/api/feedback/ingest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "Testing from node script",
    channel: "Terminal",
    customer: "Agent",
    userId: "test-123"
  })
}).then(res => res.json()).then(console.log).catch(console.error);
