import { Button } from '@/components/ui/Button'
import { createPost } from './actions'
import Input from '@/components/ui/Input'
 
export function Form() {
  return (
    <form action={createPost}>
      <Input id="title" name="title" label="Title" />
      <Input name="content" label="Content" />
      <Button type="submit">Create</Button>
    </form>
  )
}