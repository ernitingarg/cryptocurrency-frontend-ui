import ifetch from 'isomorphic-unfetch';

const fetch = async (...args: any[]) => {
  // @ts-ignore
  const res = await ifetch(...args);
  return res.json();
};

export default fetch;
