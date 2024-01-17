import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AppDescription() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Exercises</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">
            You should start here. You can freely add, delete, and edit
            exercises. Created exercises can be later used in the training
            schedule.
          </p>
          <p>
            Keep in mind that an exercise cannot be deleted if it has already
            been assigned to a schedule. &apos;Assigned To&apos; column
            indicates how many times it&apos;s been used.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Clients</AccordionTrigger>
        <AccordionContent>
          <p>
            You can add, edit, and delete clients from your list as you see fit.
            Training schedules are assigned to a client so you need to have at
            least one created to move forward.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Schedule</AccordionTrigger>
        <AccordionContent>
          <section className="mb-5">
            <h4 className="mb-2 font-semibold">Schedule</h4>
            <ul className=" list-disc pl-10 flex flex-col gap-1">
              <li>
                Once you have at least one exercise and one client, you can
                proceed with the schedule.
              </li>

              <li>
                The schedule can be saved only if a change has been detected and
                there are no red-highlighted fields.
              </li>

              <li>
                If you forget to save changes and leave the page. Next time you
                visit a dialog will pop up where you can accept loading those
                changes from cache.
              </li>

              <li>A schedule can be exported to a .xlsx file.</li>
            </ul>
          </section>

          <section className="mb-5">
            <h4 className="mb-2 font-semibold">Days</h4>
            <ul className=" list-disc pl-10 flex flex-col gap-1">
              <li>You can add days.</li>
              <li>
                You can change the order of days by clicking on the arrow
                buttons.
              </li>
              <li>Only 7 days can be created. Days can be deleted.</li>
              <li>Days can be deleted.</li>
            </ul>
          </section>

          <section>
            <h4 className="mb-2 font-semibold">Exercises</h4>
            <ul className=" list-disc pl-10 flex flex-col gap-1">
              <li>
                You can specify sets, reps, and RPE numbers for each exercise
                and comment on it.
              </li>
              <li>
                You can add exercise by clicking on a button with a plus icon.{" "}
              </li>
              <li>
                You can copy exercises by clicking the button with the copy
                symbol.
              </li>
              <li>You can delete exercise.</li>
              <li>
                You can change the order of exercises by dragging and dropping
                them freely within a day.
              </li>
              <li>
                A day can have only 8 exercises. You want to keep your client
                alive, don&apos;t you?
              </li>
            </ul>
          </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
