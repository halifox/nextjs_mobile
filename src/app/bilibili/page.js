'use client'
import {useEffect, useRef, useState} from "react"
import axios from "axios"
import _ from "lodash"
import {App, Input, List, Typography} from "antd"
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from "next/image"
import {useRouter, useSearchParams} from "next/navigation"

const {Title, Paragraph, Text} = Typography

export default function Home() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const {message, modal, notification} = App.useApp();

    const [searchValue, setSearchValue] = useState('')
    const [dataState, setDataState] = useState([])
    const data = useRef([])
    const page = useRef(1)
    const loading = useRef(false)
    const hasMore = useRef(true)

    useEffect(() => {
        data.current = []
        page.current = 1
        loading.current = false
        hasMore.current = true

        const keyword = searchParams.get('keyword')
        setSearchValue(keyword)
        setDataState([])
        loadMoreData()
    }, [searchParams])

    const handleSearch = async (keyword) => {
        if (keyword) {
            router.push(`/bilibili?keyword=${keyword}`)
        }
    }

    const handleChange = (e) => {
        setSearchValue(e.target.value) // 外部修改 searchValue
    }

    const loadMoreData = async () => {
        if (loading.current) {
            return
        }
        const keyword = searchParams.get('keyword')
        if (!keyword) {
            return
        }
        loading.current = true
        try {
            const response = await axios.get(`/api/bilibili/search?keyword=${keyword}&page=${page.current}`)
            loading.current = false
            page.current = page.current + 1
            const items = response.data.data.result
            data.current = _.concat(data.current, items)
            setDataState(data.current)
        } catch (e) {
            loading.current = false
            modal.warning({
                title: 'error',
                content: e.message,
            });
        }
    }
    return (
        <div>
            <Input.Search
                placeholder="搜索"
                value={searchValue}
                onChange={handleChange}
                onSearch={handleSearch}
                loading={loading.current}
                style={{padding: 8, paddingBottom: 0}}
                allowClear={true}
                size={'large'}
            />
            <InfiniteScroll
                dataLength={dataState.length}
                next={loadMoreData}
                hasMore={hasMore.current}
            >
                <List
                    grid={{gutter: 0, column: 2}}
                    style={{padding: 4}}
                    dataSource={dataState}
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
            </InfiniteScroll>
        </div>

    )
}
