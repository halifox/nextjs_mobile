'use client'
import axios from "axios"
import {List, Typography} from "antd"
import Image from "next/image";
import {useRouter} from "next/navigation"
import Search from "@/app/search";

const {Title, Paragraph, Text} = Typography

export default function Home() {
    const router = useRouter()
    return (
        <Search
            handleSearch={(keyword) => {
                if (keyword) router.push(`/bilibili?keyword=${keyword}`)
            }}
            fetchPageData={async (keyword, page) => {
                const response = await axios.get(`/api/bilibili/search?keyword=${keyword}&page=${page}`)
                const items = response.data.data.result
                const has_more = true
                return {items, has_more}
            }}
            renderItem={item => (
                <List.Item key={item.id} style={{padding: 4, marginBlockEnd: 0}} onClick={() => {
                    window.open(`/bilibili/video?id=${item.aid}`, '_blank', 'noopener,noreferrer')

                }}>
                    <Image
                        src={`https:${item.pic}`}
                        alt={''}
                        height={540}
                        width={960}
                        style={{
                            marginBottom: 8,
                            borderRadius: 4,
                            objectFit: 'contain',
                            aspectRatio: '16/9'
                        }}/>
                    <Title level={5}>
                        <div dangerouslySetInnerHTML={{__html: item.title}}/>
                    </Title>
                </List.Item>
            )}
        />

    )
}
