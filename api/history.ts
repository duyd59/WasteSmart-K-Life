export default function handler(req: any, res: any) {
  if (req.method === 'DELETE') {
    return res.status(200).json({ success: true, history: [] });
  }
  return res.status(200).json([]);
}
