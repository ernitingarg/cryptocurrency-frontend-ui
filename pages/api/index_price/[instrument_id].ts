import { send } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import okexClient from 'src/client/okex';

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
export const errorHandlerWrapper = (fn: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    return await fn(req, res);
  } catch (err) {
    console.error(err.stack);
    send(res, 503, { error: 'error occured' });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'application/json');
  const {
    query: { instrument_id },
  } = req;
  const instrumentId = instrument_id as string | undefined;

  if (typeof instrumentId !== 'string') {
    res.status(400).json({ error: 'instrument_id is invalid' });
    return;
  }

  const { result, error } = await okexClient.getIndexConstituents(instrumentId);
  if (error || !result) {
    res.status(500).json({ error: error?.message || 'failed okexClient.getIndexConstituents' });
    return;
  }

  const lastPrice = Number(result.data?.data?.last);
  if (!isFinite(lastPrice)) {
    res.status(500).json({ error: 'last price is not finite.' });
    return;
  }

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  res.status(200).json({ lastPrice });
};

export default errorHandlerWrapper(handler);
