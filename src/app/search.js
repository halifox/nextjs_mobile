import {useRouter, useSearchParams} from "next/navigation"
import {App, Input, List} from "antd"
import {useEffect, useRef, useState} from "react"
import _ from "lodash"
import InfiniteScroll from "react-infinite-scroll-component"

const Search = ({fetchPageData, handleSearch, renderItem}) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const {message, modal, notification} = App.useApp()

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

    const handleChange = (e) => {
        setSearchValue(e.target.value)
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
            const {items, has_more} = await fetchPageData(keyword, page.current)
            hasMore.current = has_more
            loading.current = false
            page.current = page.current + 1
            data.current = _.concat(data.current, items)
            setDataState(data.current)
        } catch (e) {
            loading.current = false
            modal.warning({
                title: 'error',
                content: e.message,
            })
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
                loader={null}>
                <List
                    grid={{gutter: 0, column: 2}}
                    style={{padding: 4}}
                    dataSource={dataState}
                    renderItem={renderItem}
                />
            </InfiniteScroll>
        </div>

    )
}

export default Search