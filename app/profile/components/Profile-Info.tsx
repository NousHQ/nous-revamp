"use client"

import { useState } from "react"
import { EnvelopeIcon, UserCircleIcon } from "@heroicons/react/24/solid"

import { Button } from "@/components/ui/button"

export default function ProfileInfo(data: any) {
  const user_data = data.user

  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const [form, setForm] = useState({
    user_name: `${user_data.user_name}`,
  })

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setIsButtonDisabled(true)
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const onCancel = () => {
    setIsButtonDisabled(false)
    setForm({
      user_name: `${user_data.user_name}`,
    })
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900">
          Profile
        </h2>
      </div>

      <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="user_name"
                  id="user_name"
                  autoComplete="given-name"
                  value={form.user_name}
                  placeholder={form.user_name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2 flex justify-around items-center">
                <EnvelopeIcon className="h-6 opacity-75 text-emerald-600 mr-2" />
                <p
                  id="email"
                  className="block select-none w-full py-1.5 font-semibold italic text-gray-500 sm:text-sm sm:leading-6"
                >
                  {data.user.email_id}
                </p>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <UserCircleIcon
                  className="h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-emerald-500/10 hover:ring-2 hover:ring-emerald-500"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {isButtonDisabled && (
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={onCancel}
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="outline"
              className="p-3 m-2 top-1 right-16 text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 hover:text-white focus:outline-none focus:ring focus:ring-gray-300"
            >
              Save
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
