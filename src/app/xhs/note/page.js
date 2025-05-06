'use client';
import {useEffect, useState} from "react";
import axios from "axios";
import {useSearchParams} from 'next/navigation';
import {Carousel, Typography} from "antd";
import Image from "next/image";
import {CommentSection} from 'react-comments-section';
import InfiniteScroll from 'react-infinite-scroll-component'
import '@/styles/react-comments.css';

const {Title, Paragraph} = Typography;

export default function Home() {
    const [data, setData] = useState();
    const [commentData, setCommentData] = useState();
    const [comments, setComments] = useState([]);

    const searchParams = useSearchParams();
    const source_note_id = searchParams.get('source_note_id')
    const xsec_token = searchParams.get('xsec_token')

    function pComments(comments) {
        if (!comments) return []
        return comments.map(element => {
            return {
                userId: element.user_info.user_id,
                comId: element.user_info.id,
                fullName: element.user_info.nickname,
                userProfile: element.user_info.image,
                text: element.content,
                timestamp: element.create_time,
                avatarUrl: element.user_info.image,
                replies: pComments(element.sub_comments)
            }
        })
    }

    const info = async () => {
        const response = await axios.get(`/api/xhs/note?source_note_id=${source_note_id}&xsec_token=${xsec_token}`);
        setData(response.data.data.items[0].note_card)
    }

    const comment = async () => {
        const response = await axios.get(`/api/xhs/comment?source_note_id=${source_note_id}&xsec_token=${xsec_token}&cursor=${commentData?.cursor ?? ''}`);
        setComments([...comments, ...pComments(response.data.data.comments)])
        setCommentData(response.data.data)
    }

    useEffect(() => {
        info()
        comment()
    }, [searchParams])

    return (
        <div>
            <Carousel draggable={true} lazyLoad={'progressive'} adaptiveHeight={true} infinite={false}>
                {data?.image_list?.map((item, index) => {
                    return (
                        <Image src={item.url_default} height={item.height} width={item.width} alt={''}/>
                    )
                })}
            </Carousel>
            <Title level={3} style={{padding: 16, paddingBottom: 0, whiteSpace: 'pre-line'}}>{data?.title}</Title>
            <Paragraph style={{padding: 16, paddingTop: 0, whiteSpace: 'pre-line'}}>{data?.desc}</Paragraph>
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
