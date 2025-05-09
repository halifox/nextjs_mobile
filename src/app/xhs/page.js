'use client'
import Search from "@/app/search";
import axios from "axios";
import _ from "lodash";
import {List, Typography} from "antd";
import Image from "next/image";
import {useRouter} from "next/navigation";


export default function Home() {
    const router = useRouter()
    return (
        <Search
            handleSearch={(keyword) => {
                if (keyword) router.push(`/xhs?keyword=${keyword}`)
            }}
            fetchPageData={async (keyword, page) => {
                const response = await axios.get(`/api/xhs/search?keyword=${keyword}&page=${page}`)
                const items = _.filter(response.data.data.items, item => item.model_type == 'note')
                const has_more = response.data.data.has_more
                return {items, has_more}
            }}
            renderItem={item => (
                <List.Item key={item.id} style={{padding: 4}} onClick={() => {
                    window.open(`/xhs/note?source_note_id=${item.id}&xsec_token=${item.xsec_token}`, '_blank', 'noopener,noreferrer')
                }}>
                    <Image
                        src={item.note_card.cover.url_default}
                        alt={''}
                        height={item.note_card.cover.height}
                        width={item.note_card.cover.width}
                        style={{
                            marginBottom: 8,
                            borderRadius: 4,
                            objectFit: 'contain',
                            aspectRatio: '3/4'
                        }}/>
                    <Typography.Title level={5}>
                        {item.note_card.display_title}
                    </Typography.Title>
                </List.Item>
            )}
        />
    )
}
