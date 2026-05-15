// Singleton set of active SSE response streams.
// One endpoint serves both admin and public clients — each side listens
// only for the events it cares about.
const clients = new Set();

const addClient = (res) => clients.add(res);
const removeClient = (res) => clients.delete(res);

/**
 * Broadcast an SSE named event to every connected client.
 * Clients that have already disconnected are silently pruned.
 */
const broadcast = (eventType, data) => {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.write(payload);
      if (typeof client.flush === "function") client.flush();
    } catch {
      clients.delete(client);
    }
  }
};

module.exports = { addClient, removeClient, broadcast };
