import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const AboutSection = () => {
  const { userId } = useParams()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [bioInput, setBioInput] = useState('')

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => axios.get(`https://haicode.fcstoys.cloud/api/users/me`).then(res => res.data.data),
    enabled: !!userId,
  })

  const updateBioMutation = useMutation({
    mutationFn: (newBio) =>
      axios.patch(`https://haicode.fcstoys.cloud/api/users/me`, { bio: newBio }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId])
      setEditing(false)
    },
  })

  if (isLoading) return <p>Đang tải...</p>
  if (!user) return <p className="text-red-500">Không tìm thấy người dùng.</p>

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Giới thiệu</h2>
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
            className="p-2 border rounded"
            rows={4}
          />
          <div className="flex gap-2">
            <button
              onClick={() => updateBioMutation.mutate(bioInput)}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Lưu
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <>
          <p>{user.bio || 'Chưa có mô tả'}</p>
          <button
            onClick={() => {
              setBioInput(user.bio || '')
              setEditing(true)
            }}
            className="mt-2 text-blue-500 hover:underline"
          >
            {user.bio ? 'Chỉnh sửa' : 'Thêm mô tả'}
          </button>
        </>
      )}
    </div>
  )
}

export default AboutSection
