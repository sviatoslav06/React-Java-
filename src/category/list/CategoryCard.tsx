import {Button, Card, Col, Popconfirm, Typography} from "antd";
import NotImage from '../../assets/imagenot.png';
import Meta from "antd/es/card/Meta";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {Link} from "react-router-dom";
import {APP_ENV} from "../../env";
import {ICategoryItem} from "./types.ts";

const { Title } = Typography;

interface ICategoryCardProps {
    item: ICategoryItem,
    handleDelete: (id: number) => void
}

const CategoryCard: React.FC<ICategoryCardProps> = (props) => {
    const {item, handleDelete} = props;
    const {id, name, description, image} = item;

    return (
        <>
            <Col style={{padding: 10}} xxl={6} lg={8} md={12} sm={12}>
                <Card
                    bodyStyle={{flex: '1', paddingBlock: '10px'}}
                    style={{height: 320, display: 'flex', flexDirection: 'column', paddingTop: '40px'}}
                    hoverable
                    cover={
                        <img
                            style={{height: '100px', objectFit: 'contain'}}
                            alt={name}
                            src={image ? `${APP_ENV.BASE_URL}/uploading/300_${image}` : NotImage}
                        />
                    }
                    actions={[
                        <Link to={`/category/edit/${id}`}>
                            <Button type="primary" icon={<EditOutlined/>}>
                                Змінити
                            </Button>
                        </Link>,

                        <Popconfirm
                            title="Ви впевнені що хочете видалити категорію?"
                            onConfirm={() => handleDelete(id)}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <Button type="primary" danger icon={<DeleteOutlined/>}>
                                Видалити
                            </Button>
                        </Popconfirm>
                    ]}
                >

                    <Meta
                        title={name}
                        description={
                            <Title level={5} type="success">{description}</Title>
                        }
                    />
                </Card>
            </Col>
        </>
    )
}

export default CategoryCard;