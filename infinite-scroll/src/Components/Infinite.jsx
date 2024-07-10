import React, { useEffect, useRef, useState } from 'react';

function Infinite() {
    const [photos, setPhotos] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchPhotos = async (pageNumber) => { 
        const Access_Key = "TyrdzqmhFlDFWG0YwuQvm4_mSn4J0OkF7PMzoEagj-0";
        const res = await fetch(`https://api.unsplash.com/photos/?client_id=${Access_Key}&page=${pageNumber}&per_page=10`);
        const data = await res.json();
        setPhotos(p => [...p, ...data]);
        setLoading(true);
    };

    useEffect(() => { 
        fetchPhotos(pageNumber);
    }, [pageNumber]);

    const loadMore = () => {
        setPageNumber(prevPageNumber => prevPageNumber + 1 );
    };

    const pageEnd = useRef();

    let num = 1;
    useEffect(() => { 
        if (loading) { 
            const observer = new IntersectionObserver(entries => { 
                if (entries[0].isIntersecting) { 
                    num++;
                    loadMore();
                    if (num >= 5) { 
                        observer.unobserve(pageEnd.current);
                    }
                }
            }, { threshold: 1 });
            observer.observe(pageEnd.current);
        }
    }, [loading]);

    const downloadPhoto = (imageUrl, fileName) => {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch(error => console.error('Error downloading image:', error));
    };

    return (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
            {photos.map((photo, index) => (
                <div className="photo-item" key={index}>
                    <img src={photo.urls.small_s3} alt="" className='rounded-lg'/>
                  
                    <button className="download-button" onClick={() => downloadPhoto(photo.urls.full, `photo_${index}.jpg`)}>Download</button>
                </div>
            ))}
            <div className="container">
                <button onClick={loadMore} ref={pageEnd} className="col-span-3" id='btns'>▼</button>
            </div>
        </div>
    );
}

export default Infinite;
