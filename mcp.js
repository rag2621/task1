const express = require('express');
const bodyParser = require('body-parser');
const nerdamer = require('nerdamer/all.min');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

function parseNaturalToExpression(query) {
  query = query.toLowerCase().trim();

  if (query.includes('factorial')) {
    const num = query.match(/\d+/)?.[0];
    return `factorial(${num})`;
  }

  if (query.includes('log')) {
    const num = query.match(/\d+(\.\d+)?/)?.[0];
    return `log(${num})`;
  }

  if (query.includes('derivative')) {
    const expr = query.match(/of (.+)/)?.[1];
    return `diff(${expr}, x)`;
  }

  if (query.includes('integral')) {
    const expr = query.match(/of (.+)/)?.[1];
    return `integrate(${expr}, x)`;
  }

  if (query.includes('solve')) {
    const expr = query.match(/solve (.+)/)?.[1];
    return expr;
  }

  return query;
}

app.post('/mcp', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    const parsedExpression = parseNaturalToExpression(query);
    const result = nerdamer(parsedExpression).evaluate().text();

    res.json({
      input: query,
      parsedExpression,
      result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MCP JSON Server running at http://localhost:${PORT}`);
});

