import React from 'react'

export default function testBuble () {
  const [foo] = React.useState('bar')

  function loadResource () {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve(Date.now())
      }, 1000)
    })
  }

  return (
    <div id="test-react">
      test-react
      <div className="foo">
        {foo}
      </div>
    </div>
  )
};


