import {PsScrollerItem} from "./ps-scroller-item";
import {Observable, Subscriber} from "rxjs";

export class PsScrollerApi {

  lines = [
    "The swift development of technology denotes a significant shift in our everyday practices, thereby influencing various aspects of life, raising the bar of what can be achieved.",
    "As individuals, we find ourselves in the midst of these sweeping changes, adapting and learning to make full use of the benefits of our technologically driven society.",
    "Continuous advancements in programming languages have changed the way we create software, making applications more efficient, optimized and intuitive.",
    "For instance, TypeScript has brought static types to JavaScript, enabling developers to write safer, self-documenting code that can also be refactored more easily.",
    "Frameworks like Angular have revolutionized the way we develop for the web, making it easier to create complex, modern web applications.",
    "Yet, the rapid pace of these improvements and their multitude raises interesting questions about the future.",
    "As Artificial Intelligence continues to progress, automating tasks and mimicking human-like decision making, its integration in software development processes becomes more of a reality.",
    "Moreover, the rise of practices like DevOps signifies a blurring of lines between the different phases of software development, making the whole process more synergistic and efficient.",
    "Indeed, these are exciting times for the world of programming. Every new framework, language, or tool brings new opportunities and challenges, pushing us to keep adapting, to keep learning.",
    "We await to see where this technological odyssey will lead us next.",
    "Every digital advancement signifies a leap towards a more interconnected world, shaping societies and economies.",
    "Plugins in IDEs allow developers to harness the full potential of a software platform, extending its capabilities, and optimizing for productivity.",
    "Integrating CI/CD pipelines into development workflows enables automatic code deployment, enhancing collaboration while reducing human-induced errors.",
    "Microservices architecture provides enhanced modularity, making the application easier to understand, develop and test.",
    "The intersection of data science and programming is spawning novel subfields, expanding our abilities to analyze and understand data.",
    "Frontend frameworks continue to evolve, offering richer user interfaces and increasing the boundaries of what's possible on the web.",
    "Cloud-native development allows organizations to deliver scalable, resilient, and manageable applications at a faster pace, optimizing for the current trends of software consumption.",
    "Adhering to a consistent code style improves code readability and maintainability, enhancing developer productivity.",
    "The rise of containerization and orchestration tools is reducing deployment complexity, making shipping and scaling applications simpler.",
    "Investing in upskilling and learning new programming paradigms and languages can usher in unanticipated solutions to common problems.",
    "The continued development of cross-platform solutions is blurring the delineation between different operating systems and devices.",
    "In an increasingly data-driven society, managing and effectively leveraging large datasets has become a critical skill.",
    "A surge in machine learning libraries is democratizing access to AI technologies, proliferating its use across different industries.",
    "Open source movement continues to thrive, fostering community-driven software development, promoting transparency and collaboration.",
    "The solid principles of software engineering remain crucial, driving the continual improvement of codebases.",
    "Programming paradigms, such as functional and procedural, offer different approaches to solving problems, enhancing our conceptual toolset.",
    "The pervasiveness of APIs makes it possible to build upon pre-existing platforms and services, improving development efficiency.",
    "Lightweight and scalable architecture is more important than ever amidst an exponential increase in users and use-cases.",
    "We strive for code that not only works but is also well-structured, testable, maintainable, and understandable.",
    "Optimized compilers continue to be developed, reducing runtimes and improving the performance of our applications.",
    "The proliferation of IoT devices brings about new layers of complexity and innovation in the field of programming.",
    "The swift development of technology denotes a significant shift in our everyday practices, thereby influencing various aspects of life, raising the bar of what can be achieved.",
    "As individuals, we find ourselves in the midst of these sweeping changes, adapting and learning to make full use of the benefits of our technologically driven society.",
    "Continuous advancements in programming languages have changed the way we create software, making applications more efficient, optimized and intuitive.",
    "For instance, TypeScript has brought static types to JavaScript, enabling developers to write safer, self-documenting code that can also be refactored more easily.",
    "Frameworks like Angular have revolutionized the way we develop for the web, making it easier to create complex, modern web applications.",
    "Yet, the rapid pace of these improvements and their multitude raises interesting questions about the future.",
    "As Artificial Intelligence continues to progress, automating tasks and mimicking human-like decision making, its integration in software development processes becomes more of a reality.",
    "Moreover, the rise of practices like DevOps signifies a blurring of lines between the different phases of software development, making the whole process more synergistic and efficient.",
    "Indeed, these are exciting times for the world of programming. Every new framework, language, or tool brings new opportunities and challenges, pushing us to keep adapting, to keep learning.",
    "We await to see where this technological odyssey will lead us next.",
    "Every digital advancement signifies a leap towards a more interconnected world, shaping societies and economies.",
    "Plugins in IDEs allow developers to harness the full potential of a software platform, extending its capabilities, and optimizing for productivity.",
    "Integrating CI/CD pipelines into development workflows enables automatic code deployment, enhancing collaboration while reducing human-induced errors.",
    "Microservices architecture provides enhanced modularity, making the application easier to understand, develop and test.",
    "The intersection of data science and programming is spawning novel subfields, expanding our abilities to analyze and understand data.",
    "Frontend frameworks continue to evolve, offering richer user interfaces and increasing the boundaries of what's possible on the web.",
    "Cloud-native development allows organizations to deliver scalable, resilient, and manageable applications at a faster pace, optimizing for the current trends of software consumption.",
    "Adhering to a consistent code style improves code readability and maintainability, enhancing developer productivity.",
    "The rise of containerization and orchestration tools is reducing deployment complexity, making shipping and scaling applications simpler.",
    "Investing in upskilling and learning new programming paradigms and languages can usher in unanticipated solutions to common problems.",
    "The continued development of cross-platform solutions is blurring the delineation between different operating systems and devices.",
    "In an increasingly data-driven society, managing and effectively leveraging large datasets has become a critical skill.",
    "A surge in machine learning libraries is democratizing access to AI technologies, proliferating its use across different industries.",
    "Open source movement continues to thrive, fostering community-driven software development, promoting transparency and collaboration.",
    "The solid principles of software engineering remain crucial, driving the continual improvement of codebases.",
    "Programming paradigms, such as functional and procedural, offer different approaches to solving problems, enhancing our conceptual toolset.",
    "The pervasiveness of APIs makes it possible to build upon pre-existing platforms and services, improving development efficiency.",
    "Lightweight and scalable architecture is more important than ever amidst an exponential increase in users and use-cases.",
    "We strive for code that not only works but is also well-structured, testable, maintainable, and understandable.",
    "Optimized compilers continue to be developed, reducing runtimes and improving the performance of our applications.",
    "The proliferation of IoT devices brings about new layers of complexity and innovation in the field of programming."
  ];

  list(skip: number, take: number): Observable<PsScrollerItem[]> {
    return new Observable<PsScrollerItem[]>(
      (subscriber: Subscriber<PsScrollerItem[]>) => {
        const res = this.lines.slice(skip, skip + take)
          .map((line: string, index: number) =>
            new PsScrollerItem(skip + index, line));
        const t = Math.random()*1500;
        setTimeout(() => subscriber.next(res), t);
      });
  }
}
