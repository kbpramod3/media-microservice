import * as authService from "../services/authService.js";

export async function signup(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authService.signup(email, password);
    res.status(201).json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
