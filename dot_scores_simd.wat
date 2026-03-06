(module
  (memory (export "memory") 1)

  ;; dot_scores_simd(embPtr, qPtr, N, D, outPtr)
  ;; embeddings: f32[N*D], query: f32[D], out: f32[N]
  ;; 返り値: 0
  (func (export "dot_scores_simd")
    (param $emb i32) (param $q i32) (param $N i32) (param $D i32) (param $out i32)
    (result i32)

    (local $i i32)
    (local $j i32)
    (local $strideBytes i32)
    (local $rowPtr i32)
    (local $qPtr i32)
    (local $outPtr i32)
    (local $acc v128)
    (local $vEmb v128)
    (local $vQ v128)
    (local $sum f32)

    ;; strideBytes = D * 4
    local.get $D
    i32.const 2
    i32.shl
    local.set $strideBytes

    i32.const 0
    local.set $i

    (block $break_i
      (loop $loop_i
        ;; if (i >= N) break
        local.get $i
        local.get $N
        i32.ge_u
        br_if $break_i

        ;; rowPtr = emb + i*strideBytes
        local.get $emb
        local.get $i
        local.get $strideBytes
        i32.mul
        i32.add
        local.set $rowPtr

        ;; outPtr = out + i*4
        local.get $out
        local.get $i
        i32.const 2
        i32.shl
        i32.add
        local.set $outPtr

        ;; qPtr = q
        local.get $q
        local.set $qPtr

        ;; acc = 0
        v128.const f32x4 0 0 0 0
        local.set $acc

        ;; j = 0 (bytes offset)
        i32.const 0
        local.set $j

        (block $break_j
          (loop $loop_j
            ;; if (j >= strideBytes) break
            local.get $j
            local.get $strideBytes
            i32.ge_u
            br_if $break_j

            ;; vEmb = *(v128*)(rowPtr + j)
            local.get $rowPtr
            local.get $j
            i32.add
            v128.load
            local.set $vEmb

            ;; vQ = *(v128*)(qPtr + j)
            local.get $qPtr
            local.get $j
            i32.add
            v128.load
            local.set $vQ

            ;; acc += vEmb * vQ
            local.get $acc
            local.get $vEmb
            local.get $vQ
            f32x4.mul
            f32x4.add
            local.set $acc

            ;; j += 16 (4 floats)
            local.get $j
            i32.const 16
            i32.add
            local.set $j

            br $loop_j
          )
        )

        ;; horizontal sum of acc lanes
        ;; sum = acc[0] + acc[1] + acc[2] + acc[3]
        local.get $acc
        f32x4.extract_lane 0
        local.get $acc
        f32x4.extract_lane 1
        f32.add
        local.get $acc
        f32x4.extract_lane 2
        f32.add
        local.get $acc
        f32x4.extract_lane 3
        f32.add
        local.set $sum

        ;; store sum to outPtr
        local.get $outPtr
        local.get $sum
        f32.store

        ;; i++
        local.get $i
        i32.const 1
        i32.add
        local.set $i

        br $loop_i
      )
    )

    i32.const 0
  )
)
