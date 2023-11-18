import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import Image from 'next/image';
import { useRouter } from 'next/router';
import supabase from '../../utils/supabaseClient';

const inter = Inter({ subsets: ['latin'] })

type Link = {
  title: string;
  url: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();
  const [links, setLinks] = useState<Link[]>();
  const [images, setImages] = useState<ImageListType>([]);
  const [profile_picture_url, setProfilePictureUrl] = useState<string | undefined>();
  const router = useRouter();
  const { creatorSlug } = router.query;

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log("user", user);
      if (user) {
        const userId = user.data.user?.id;
        setIsAuthenticated(true);
        setUserId(userId);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const getLinks = async () => {
      try {
        const { data, error } = await supabase
          .from("links")
          .select("title, url")
          .eq("user_id", userId);

      if (error) throw error;
        setLinks(data);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    if (userId) {
      getLinks()
    }
  }, [userId]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error} = await supabase
          .from("users")
          .select("id, profile_picture_url")
          .eq("username", creatorSlug);
        if (error) throw error;
        const profilePictureUrl = data[0]["profile_picture_url"];
        const userId = data[0]["id"];
        setProfilePictureUrl(profilePictureUrl);
        setUserId(userId);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    if (creatorSlug) {
      getUser()
    }
  }, [creatorSlug]);


  const addNewLink = async () => {
    try {
      if (title && url && userId) {
        const { data, error } = await supabase.from("links").insert({
        title: title,
        url: url,
        user_id: userId,
    }).select();

      if (error) throw error;
        console.log("data: ", data)

      if (links){
        setLinks([...data, ...links])
      }
    }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const uploadProfilePicture = async () => {
    try {
    if (images.length > 0) {
      const image = images[0];
      if (image.file && userId) {
        const { data, error } = await supabase.storage
          .from("public1")
          .upload(`${userId}/${image.file.name}`, image.file, { 
            upsert: true 
          });
        
          if (error) throw error;
          const resp = supabase.storage.from("public1").getPublicUrl(data.path);
          const publicUrl = resp.data.publicUrl;
          const updateUserResponse = await supabase
          .from("users")
          .update({ profile_picture_url: publicUrl })
          .eq("id", userId);
          if (updateUserResponse.error) throw error;
        }
      }
    } catch (error) {
      console.log("error: ", error)
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (

    <div className="flex flex-col w-full justify-center items-center mt-4">
      
      {profile_picture_url && (
        <Image 
          src={profile_picture_url}
          alt='profile-picture'
          height={100}
          width={100}
          className='rounded-full'
      />
      )}

      {profile_picture_url && (
        <p className="mt-2 text-gray-800 font-semibold text-lg capitalize">
          @{creatorSlug}
        </p>
      )}

      {links?.map((link: Link, index: number) => (
        
        <div 
          className="shadow-xl w-96 custom-color1 mt-4 p-4 rounded-full text-center text-white cursor-pointer"
          key={index}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = link.url;
          }}
          >{link.title}
        </div>
      ))}

      {isAuthenticated && (
      <>

        <div className='mt-8'>

          <button
            onClick={logout}
            className="absolute top-4 right-4 px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform border border-gray-200 rounded-lg hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            >
              Logout
          </button>

          <h1 className='text-gray-800 font-semibold text-md capitalize'> 
            New Link Creation
          </h1>
            <div className="mt-4">
              <div className="block text-sm font-medium text-gray-700">
                Title
              </div>
              <input 
                type="text" 
                name="title"
                id="title"
                placeholder="my awesome link" 
                className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

          <div className="mt-4">
            <div className="block text-sm font-medium text-gray-700">
              URL
            </div>
            <input 
              type="text" 
              name="url"
              id="url"
              placeholder="https://github.com/jahnltib" 
              className="block w-full py-2.5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button 
            type="button"
            className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform custom-color1 rounded-lg hover:custom-color1 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mt-4"
            onClick={addNewLink}
          >
            Add new link
          </button>

        </div>
      
      
        <div className='mt-8 mb-4'>
          

          <h1 className='text-gray-800 font-semibold text-md capitalize'>
            Image uploading
          </h1>
          
          {images.length > 0 && (
          <Image
            src={images[0]["data_url"]}
            height={100}
            width={100}
            alt="profile-picture"
          />
          )}
                
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={1}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (

              <div className={`upload__image-wrapper mt-2 custom-color3 rounded-lg p-4 ${isDragging ? 'highlight' : ''}`}>

                <button
                  style={isDragging ? { color: 'red' } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                  className="rounded-lg p-2"
                  >
                  Click Here or Drag and Drop a New Image to Upload.
                </button>

                {imageList.length > 0 && (
                  <button onClick={onImageRemoveAll} className="mt-2 rounded-lg p-2 custom-color2 text-white">
                    Remove all images
                  </button>
                )}

                {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image['data_url']} alt="" width="100" className="rounded-lg mb-2" />
                    <div className="image-item__btn-wrapper">
                      <button onClick={() => onImageUpdate(index)} className="mr-2 rounded-lg p-3 custom-color1 text-white">
                        Update
                      </button>
                      <button onClick={() => onImageRemove(index)} className="rounded-lg p-3 custom-color2 text-white">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

              </div>

            )}

          </ImageUploading>

        </div>

        <div className='mt-4'>
          <button 
            type="button"
            className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform custom-color1 rounded-lg hover:custom-color1 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 mb-4"
            onClick={uploadProfilePicture}
          >
            Upload profile picture
          </button>
        </div>

      </>
      )}

    </div>
  )
}

