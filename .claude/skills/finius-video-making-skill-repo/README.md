# Finius Video Making Skill Repo

A reusable skill for making long-form, in-depth documentary-style YouTube videos (20–60 min), built from a
frame-by-frame study of the FINAiUS channel's documentary craft. It covers the whole job: topic, research, script,
voice, visuals, edit timing, sound mix, quality checks and packaging.

```
finius-video-making-skill-repo/
├── SKILL.md                  ← the skill (rules, workflow, specs). Start here.
├── README.md                 ← this file: how to use it in any tool
├── references/
│   ├── playbook.md           ← full spec with every recipe, number, snippet and template
│   └── research/             ← the evidence: 15 agents' shot logs and measurements + website/interview notes
└── scripts/
    └── qa_video.py           ← automatic check of a finished render (pacing, static holds, loudness, cut sync)
```

## Use it in Claude Code
It lives in `.claude/skills/`, so Claude Code in this repo finds it automatically. Ask for it by name:

> Use the Finius Video Making Skill Repo to make the next episode.

or `/finius-video-making-skill-repo`. Claude Code also picks it up on its own when you ask for a long-form video.

To use it in another repo or on another machine: copy this folder into that repo's `.claude/skills/`, or into
`~/.claude/skills/` to have it in every project.

## Use it in other AI tools
The skill is plain Markdown with no tool-specific code, so any assistant can follow it.

| Tool | How |
|---|---|
| **Claude.ai (Projects)** | Upload `SKILL.md` and `references/playbook.md` as project knowledge. Add the research files you need. Or zip this folder and add it as a Skill in Settings → Capabilities if your plan supports custom skills |
| **ChatGPT (Projects / Custom GPT)** | Upload `SKILL.md` + `references/playbook.md` as files; paste §1 (the 12 rules) and §9 (channel rules) of SKILL.md into the instructions |
| **Cursor** | Copy `SKILL.md` to `.cursor/rules/finius-video.mdc` (add `description:` frontmatter, `alwaysApply: false`) and keep `references/` in the repo |
| **OpenAI Codex / other agents that read `AGENTS.md`** | Add a line to `AGENTS.md`: "For long-form videos, follow `.claude/skills/finius-video-making-skill-repo/SKILL.md`." |
| **Gemini / any chat** | Paste `SKILL.md` at the start of the conversation; attach `playbook.md` when building |

Tools that cannot run commands simply skip `scripts/qa_video.py` and use the checklist in SKILL.md §8.

## Requirements for the full pipeline
- ffmpeg/ffprobe and Python 3 with numpy (for `scripts/qa_video.py`)
- A TTS voice, whisper word timing, a motion-graphics renderer (we use HyperFrames: HTML + GSAP → MP4), licensed
  music, an SFX library. In this project those tools live in the local `series-production/` folder, which is not
  committed; the skill tells you what each one does so another setup can swap in its own.

## What this skill will not do
- Copy the FINAiUS creator's story, script, images, 3D sets, thumbnails or footage. Only the craft is copied.
- Use feature-film clips.
- Post, schedule or spend credits without the user's OK.
