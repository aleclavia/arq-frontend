import { Helmet } from 'react-helmet'

const MetaData = ({ title }) => (
  <Helmet>
    <title>{title ? `${title} | ARQANE ARQADE` : 'ARQANE ARQADE'}</title>
  </Helmet>
)

export default MetaData
