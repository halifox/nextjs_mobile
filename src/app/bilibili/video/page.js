'use client';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useRouter, useSearchParams} from 'next/navigation';
import {Button, List, Typography} from "antd";
import {CommentSection} from "react-comments-section";
import InfiniteScroll from "react-infinite-scroll-component";
import '@/styles/react-comments.css';

export default function Home() {
    const [url, setUrl] = useState();
    const [data, setData] = useState();
    const commentPage = useRef(1);
    const [commentData, setCommentData] = useState();
    const [comments, setComments] = useState([]);

    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id')
    const cid = searchParams.get('cid')

    function pComments(comments) {
        if (!comments) return []
        return comments.map(element => {
            return {
                userId: element.mid,
                comId: element.rpid,
                fullName: element.member.uname,
                userProfile: null,
                text: element.content.message,
                timestamp: element.ctime,
                avatarUrl: "/api/proxy?url=" + element.member.avatar,
                replies: pComments(element.replies)
            }
        })
    }

    const info = async () => {
        if (id) {
            const response = await axios.get(`/api/bilibili/info?id=${id}`);
            setData(response.data.data)
            const cid = response.data.data.pages[0].cid
            router.replace(`/bilibili/video?id=${id}&cid=${cid}`)
        }
    }
    const video = async () => {
        if (id && cid) {
            const response = await axios.get(`/api/bilibili/video?id=${id}&cid=${cid}`);
            setUrl(response.data.data.durl[0].url)
        }
    }
    const comment = async () => {
        const id = searchParams.get('id')
        const response = await axios.get(`/api/bilibili/comment?id=${id}&page=${commentPage.current++}`);
        setComments([...comments, ...pComments(response.data.data.replies)])
        setCommentData(response.data.data)
    }
    useEffect(() => {
        info()
        video()
        comment()
    }, [searchParams])
    return (
        <div>
            <video controls src={url} width="1280" height="720"/>
            <Typography.Title level={4} style={{padding: 8, whiteSpace: 'pre-line'}}>{data?.title}</Typography.Title>
            <Typography.Paragraph style={{padding: 8, paddingTop: 0, whiteSpace: 'pre-line'}}>{data?.desc}</Typography.Paragraph>
            <List
                grid={{gutter: 0, column: 1}}
                style={{padding: 4}}
                dataSource={data?.pages}
                renderItem={item => (
                    <List.Item key={item.cid} style={{padding: 4, marginBlockEnd: 0}}>
                        <Button
                            style={{width: '100%', wordWrap: 'break-word', whiteSpace: 'normal', height: 'auto'}}
                            type={item.cid == cid ? 'primary' : 'default'}
                            onClick={() => item.cid == cid ? null : window.location.replace(`/bilibili/video?id=${id}&cid=${item.cid}`)}
                        >
                            {item.part}
                        </Button>
                    </List.Item>
                )}
            />
            <InfiniteScroll
                dataLength={comments.length}
                next={comment}
                hasMore={commentData?.has_more ?? true}
                loader={<p>加载中...</p>}
                endMessage={<p>没有更多评论</p>}
            >
                <CommentSection
                    currentUser={null}
                    logIn={null}
                    commentData={comments}
                />
            </InfiniteScroll>
        </div>
    );
}
