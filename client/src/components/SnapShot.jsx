import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

const Snapshot = () => {
  // const [products, setProducts] = useState([])

  return (
    
      <CardGroup>
       <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>💵</Card.Header>
        <Card.Body>
          <Card.Title>{}Cash flow in last 30 days.</Card.Title>
          <Card.Text>
            More information 💲 { /*<Link to="/charts">💲 </Link>*/}
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="warning" style={{ width: '18rem' }}>
        <Card.Header>⚠️ </Card.Header>
        <Card.Body>
          <Card.Title>Pending Tasks</Card.Title>
          <Card.Text>
            You have {/*count*/}🔢  tasks today. {/*<Link to="/toDo">🔢</Link> */}
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card border="danger" style={{ width: '18rem' }}>
        <Card.Header>👎</Card.Header>
        <Card.Body>
          <Card.Title>Outstanding Invoices</Card.Title>
          <Card.Text>
            This is cash not in your hand! 💸 {/*<Link to="/finance/">🫴</Link> */}
          </Card.Text>
        </Card.Body>
      </Card>
      </CardGroup>
    
  )
}

export default Snapshot