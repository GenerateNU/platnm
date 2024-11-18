import React from 'react';

const ReviewContent = () => {
  return (
    <div style={{ padding: '10px' }}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>
      <a href="#" style={{ color: '#007BFF', textDecoration: 'none' }}>
        Read more
      </a>
      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
        <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '20px' }}>Headscratcher</span>
        <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '20px' }}>Magnum Opus</span>
        <span style={{ background: '#eee', padding: '5px 10px', borderRadius: '20px' }}>Experimental</span>
      </div>
    </div>
  );
};

export default ReviewContent;
