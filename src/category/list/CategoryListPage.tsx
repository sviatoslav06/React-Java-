import {Button, Col, Form, Input, Pagination, Row} from "antd";
import {Link, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ICategorySearch, IGetCategories} from "./types.ts";
import http_common from "../../http_common.ts";
import CategoryCard from "./CategoryCard.tsx";

const CategoryListPage = () => {
    // Змінна яка містить в собі інформацію про категорії, витягнуті з бази, кількість сторінок які будуть відображатись,
    // кількість елементів на сторінціі
    const [data, setData] = useState<IGetCategories>({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0
    });

    // Змінна яка містить в собі параметри пошукового запиту
    const [searchParams, setSearchParams] = useSearchParams();

    // Змінна, яка містить параметри пошуку та задає їм дефолтні значення
    const [formParams, setFormParams] = useState<ICategorySearch>({
        name: searchParams.get('name') || "",
        page: Number(searchParams.get('page')) || 1,
        size: Number(searchParams.get('size')) || 2
    });

    // Форма
    const [form] = Form.useForm<ICategorySearch>();

    // Функція, яка буде виконана при натисканні кнопки. Функція задає номер сторінки, зчитує пошукові параметри
    const onSubmit = async (values: ICategorySearch) => {
        findCategories({...formParams, page: 1, name: values.name});
    }


    useEffect(() => {
        http_common.get<IGetCategories>("/api/categories/search", { // Запит на сервер методом get
            params: {
                ...formParams,
                page: formParams.page-1 // скидання сторінки на нульеву при пошуку
            }
        })
            .then(resp => {
                console.log("Items", resp.data); // вивід даних в консоль
                setData(resp.data); // задання змінній data отриманих даних при пошуку
                form.setFieldsValue(formParams); // заповнення форми зчитаними з БД даними
            });
    }, [formParams]);

    // Змінна, яка зберігає в собі всі категорії та їхню кількість
    const {content, totalElements} = data;

    const handleDelete = async (id: number) => {
        try {
            await http_common.delete(`/api/categories/${id}`); // Запит на видалення категорії
            setData({ ...data, content: content.filter(x => x.id != id)} ); // Видалення предметів по id
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    }

    const handlePageChange = async (page: number, newPageSize: number) => {
        findCategories({...formParams, page, size: newPageSize}); // Оновлення сторінки після пошуку
    };

    const findCategories = (model: ICategorySearch) => {
        setFormParams(model); // Задання формі параметрів моделі, яка була знайдена під час пошуку
        updateSearchParams(model); // Оновлення пошукових параметрів
    }

    // Функція, яка перевіряє чи є поле пошуку пустим, тоді сетить в параметри пошуковий запит
    const updateSearchParams = (params : ICategorySearch) =>{
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== 0 && value!="") {
                searchParams.set(key, value);
            } else {
                searchParams.delete(key);
            }
        }
        setSearchParams(searchParams);
    };

    return (
        <>
            <h1>Список категорій</h1>
            <Link to={"/category/create"}>
                <Button size={"large"}>Додати</Button>
            </Link>

            <Row gutter={16}>
                <Form form={form}
                      onFinish={onSubmit}
                      layout={"vertical"}
                      style={{
                          minWidth: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          padding: 20,
                      }}
                >
                    <Form.Item
                        label="Назва"
                        name="name"
                        htmlFor="name"
                    >
                        <Input autoComplete="name"/>
                    </Form.Item>

                    <Row style={{display: 'flex', justifyContent: 'center'}}>
                        <Button style={{margin: 10}} type="primary" htmlType="submit">
                            Пошук
                        </Button>
                        <Button style={{margin: 10}} htmlType="button" onClick={() =>{ }}>
                            Скасувати
                        </Button>
                    </Row>
                </Form>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Row>
                        {content.length === 0 ? (
                            <h2>Список пустий</h2>
                        ) : (
                            content.map((item) =>
                                <CategoryCard key={item.id} item={item} handleDelete={handleDelete} />,
                            )
                        )}
                    </Row>
                </Col>
            </Row>
            <Row style={{width: '100%', display: 'flex', marginTop: '25px', justifyContent: 'center'}}>
                <Pagination
                    showTotal={(total, range) => {
                        console.log("range ", range);
                        return (`${range[0]}-${range[1]} із ${total} записів`);
                    }}
                    current={formParams.page}
                    defaultPageSize={formParams.size}
                    total={totalElements}
                    onChange={handlePageChange}
                    pageSizeOptions={[1, 2, 5, 10]}
                    showSizeChanger
                />
            </Row>
        </>
    )
}

export default CategoryListPage;