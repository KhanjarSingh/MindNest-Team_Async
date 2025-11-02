import React, { useEffect, useState } from 'react';

export default function Home(){
  const [msg, setMsg] = useState('loading...');
  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(() => setMsg('Could not reach API'));
  }, []);
  return (
    <div>
      <h1>Home of the MindNest</h1>
      <p>API says: {msg}</p>
      <h2>Work in Progress</h2>
    </div>
  );
}
