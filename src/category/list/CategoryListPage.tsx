import {Button, Table} from "antd";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ICategoryItem} from "./types.ts";
import {APP_ENV} from "../../env";
import {ColumnsType} from "antd/es/table";
import http_common from "../../http_common.ts";

const CategoryListPage: React.FC = () => {
    const [list, setList] =useState<ICategoryItem[]>();
    const [renderNeeded, setRenderNeeded] = useState(true);
    const imagePath = `${APP_ENV.BASE_URL}/uploading/150_`;

    const columns: ColumnsType<ICategoryItem> = [
        {
            title: "#",
            dataIndex: "id"
        },
        {
            title: "Назва",
            dataIndex: "name"
        },
        {
            title: "Фото",
            dataIndex: "image",
            render: (image: string) => {
                return (
                    <img src={`${imagePath}${image}`} alt="Category"/>
                )
            }
        },
        {
            title: "Опис",
            dataIndex: "description"
        }
    ];

    useEffect(() => {
        if(!renderNeeded) return;
        (async () => {
            const response = await http_common.get("/api/categories");
            setList(response.data);
            setRenderNeeded(false);
        })();
    },[renderNeeded])

    return (
        <>
            <h1>Список категорій</h1>
            <Link to={"/category/create"}>
                <Button size={"large"}>Додати</Button>
            </Link>
            <Table columns={columns} rowKey={"id"} dataSource={list} size={"middle"}/>
        </>
    )
}

export default CategoryListPage;