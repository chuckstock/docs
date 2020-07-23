import React from 'react'
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'
import highlight from 'rehype-highlight'
import classNames from 'classnames'

import RemarkNote from '~/components/text/remark-note'
import RemarkCaption from '~/components/text/remark-caption'

const RemarkRenderer = ({
  caption,
  allowCopy,
  contentType,
  children,
  components
}) => {
  const markdownProcessor = unified()
    .use(markdown)
    .use(remark2rehype)
    .use(highlight)
    .use(rehype2react, {
      createElement: React.createElement,
      components
    })

  return contentType === 'default' ? (
    <>{markdownProcessor.processSync(children).result}</>
  ) : contentType === 'note' ? (
    <RemarkNote type="note">
      {markdownProcessor.processSync(children).result}
    </RemarkNote>
  ) : contentType === 'warning' ? (
    <RemarkNote type="warning">
      {markdownProcessor.processSync(children).result}
    </RemarkNote>
  ) : contentType === 'caption' ? (
    <RemarkCaption components={{ ...components }}>{children}</RemarkCaption>
  ) : contentType === 'code' ? (
    <>
      <div className={classNames({ 'allow-copy': allowCopy === true })}>
        {markdownProcessor.processSync(children).result}
      </div>
      <RemarkCaption components={{ ...components }}>{caption}</RemarkCaption>
    </>
  ) : contentType === undefined ? (
    <>{markdownProcessor.processSync(children).result}</>
  ) : (
    <div style={{ marginLeft: '2rem', fontSize: '0.9rem' }}>
      unsupported <b>markdown</b> contentType type:{' '}
      <pre style={{ display: 'inline', backgroundColor: '#FFFF00' }}>
        {contentType}
      </pre>
    </div>
  )
}

export default RemarkRenderer
