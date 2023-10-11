'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    useEffect(() => {
    const id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const tokenSecret = process.env.NEXT_PUBLIC_TOKEN_SECRET;
    if (!id || !token || !tokenSecret) {
        router.push('/');
    }
        axios({
            method: 'post',
            url: 'http://localhost:3001/users/get-profile',
            data: {
                user_id: id,
            },
            headers: {
                Authorization: `Bearer ${token}|${tokenSecret}`,
            }
        }).then((response) => {
            if (response.data.status === 'success') {
                console.log(response.data);
            }
        }).catch((error) => {
            console.log(error);
        })
    }, []);


    return (
        <h1>Welcome to Chat page</h1>
    )
}
