import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap';

interface ServiceCardProps {
  title: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
        <Card.Text>---------------------------------------</Card.Text>
        <Card.Link href="#" >Buy</Card.Link>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;
